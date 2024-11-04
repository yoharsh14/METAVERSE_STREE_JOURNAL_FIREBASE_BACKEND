const db = require("../firebase");
const getAllArticles = async (req, res, next) => {
  try {
    const articlesSnapshot = await db.collection("articles").get();
    const articles = [];
    articlesSnapshot.forEach((doc) => {
      const documentId = doc.id;
      const data = doc.data();
      articles.push({
        _id: documentId,
        title: data.title,
        body: data.body,
        highlight: data.highlight,
        SEOTags: data.SEOTags,
        categories: data.categories,
        customUrl: data.customUrl,
        extraImages: data.extraImages,
        featuredImage: data.featuredImage,
        font: data.font,
        likes: data.likes,
        view: data.views,
      });
    });
    res.status(200).json(articles);
  } catch (e) {
    console.log("Error in getAllArticle controller", e.message);
    res.status(404).json({ error: e });
  }
};
// const getFullArticleById = async (req, res, next) => {
//   try {
//   } catch (e) {}
// };
const getByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;

    //1. Retrieve the Category Document
    const categoryDoc = await db.collection("categories").doc(categoryId).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({ message: "this category does not exist" });
    }
    const categoryData = categoryDoc.data();

    //2. Get Article IDs
    const articleIds = categoryData.articles || [];

    //3.fetching Articles
    const articles = [];
    for (const articleId of articleIds) {
      const articleDoc = await db.collection("articles").doc(articleId).get();
      if (articleDoc.exists) {
        const data = articleDoc.data();
        articles.push({
          _id: articleId,
          title: data.title,
          body: data.body,
          highlight: data.highlight,
          SEOTags: data.SEOTags,
          categories: data.categories,
          customUrl: data.customUrl,
          extraImages: data.extraImages,
          featuredImage: data.featuredImage,
          font: data.font,
          likes: data.likes,
          view: data.views,
        });
      }
    }
    res.status(200).json(articles);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
// const getRecommended = async (req, res, next) => {
//   try {
//   } catch (e) {}
// };
const addArticle = async (req, res, next) => {
  try {
    const {
      title,
      body,
      highlight,
      SEOTags,
      font,
      CollaboratorIds,
      customUrl,
      featuredImage,
      categories,
      extraImages,
    } = req.body;
    // Create the article document
    const articleRef = db.collection("articles").doc();
    const articleId = articleRef.id; // Get the generated ID

    // Prepare Collaborator data
    const Collaborator = CollaboratorIds.map((id) => ({
      user: id,
      approved: true,
    }));

    // Create the article data
    const articleData = {
      title,
      body,
      highlight,
      font,
      Collaborator,
      SEOTags,
      customUrl,
      categories,
      featuredImage,
      extraImages,
      views: 0,
      likes: 0,
    };

    // Save the article to Firestore
    await articleRef.set(articleData);

    // Update categories (similar to your MongoDB code)
    await Promise.all(
      categories.map(async (cat) => {
        const categoryRef = db.collection("categories").doc(cat);
        const categoryDoc = await categoryRef.get();

        if (!categoryDoc.exists) {
          // Create a new category
          await db
            .collection("categories")
            .doc(cat)
            .set({
              category: cat,
              articles: [articleId],
            });
        } else {
          // Update existing category
          const updatedArticles = categoryDoc.data().articles; // Get the existing array
          updatedArticles.push(articleId);
          await categoryRef.update({
            articles: updatedArticles,
          });
        }
      })
    );

    // Send success response
    res.status(200).json({
      _id: articleId,
      title,
      body,
      highlight,
      Collaborator,
      SEOTags,
      customUrl,
      extraImages,
      views: 0,
      likes: 0,
    });
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).json({ error: "Failed to add article" });
  }
};
// const updateArticle = async (req, res, next) => {
//   try {
//   } catch (e) {}
// };

module.exports = {
  addArticle,
  getByCategory,
  getAllArticles,
};
