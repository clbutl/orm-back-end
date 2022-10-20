const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }]
    });
    console.log('Get Request')

    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagData = await Tag.findByPk( req.params.id, {
      include: [{ model: Product }]
    });
    console.log('Get Request')

    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  console.log('post Request')
  // create a new tag
  try {
    const tags = await Tag.create({
      tag_name: req.body.tag_name
    })
    res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', (req, res) => {
  console.log('put Request')
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  console.log('delete Request')
  // delete on tag by its `id` value
});

module.exports = router;
