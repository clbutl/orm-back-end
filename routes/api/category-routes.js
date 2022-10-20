const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    console.log('Get Request')
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    console.log('Get Request')
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    })

    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const category = await Category.create({
      category_name: req.body.category_name
    })
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    console.log('Put Request')

  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    console.log('Delete Request')

  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
