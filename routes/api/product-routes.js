const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try {
    const productData = await Product.findAll({
      include: [{ model: Tag }]
    });
    console.log('Get Request')

    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    console.log('Get Request')
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Tag }]
    })

    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', (req, res) => {
  console.log('post Request')
  try {
    Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tagIds: req.body.tagIds
    })
    .then((product) => {
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
        // if no product tags, just respond
        res.status(200).json(product);
      })
    .then((productTagIds) => res.status(200).json(productTagIds))
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update product
router.put('/:id', (req, res) => {
  console.log('put Request')
  // update product data
  try {
    Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((product) => {
        // find all associated tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((productTags) => {
        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
  
        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      res.status(200).json('Updated product')
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  console.log('delete Request')
  // delete one product by its `id` value
  try {
    await Product.destroy({ where: {id: req.params.id} })
    res.status(200).json('Deleted Product')
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
