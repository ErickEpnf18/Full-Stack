const dummy = (blogs) => {
  // console.log(blogs.length);
  return 1;
};

const totalLikes = (array) => {
  const reducer = (sum, { likes }) => sum + likes;

  return array.reduce(reducer, 0);
};

const favoriteBlog = (array) => {
  const mostLikes = Math.max(...array.map(({ likes }) => likes));

  const blog = array.filter(({ likes }) => likes === mostLikes);

  const { title, author, likes } = blog[0];
  return { title, author, likes };
};

const mostBlogs = (array) => {
  const reducer = (authors, object) => {
    authors[object.author] = authors[object.author] || [];
    authors[object.author].push({
      author: object.author,
    });
    authors.push({
      blogs: authors[object.author].length,
      author: object.author,
    });
    return authors;
  };

  const uniqueAuthors = array.reduce(reducer, []);
  const maxBlog = Math.max(...uniqueAuthors.map((item) => item.blogs));
  const topBlogger = uniqueAuthors.filter((item) => item.blogs === maxBlog);

  const { author, blogs } = topBlogger[0];

  return { author, blogs };
};

const mostLikes = (array) => {

  const reducerOnlyAuthors = (value, index, arr) => {
    const authors = arr.map((_) => _.author);
    return authors.indexOf(value.author) === index; // return first coincidence with the index
  };

  const onlyAuthors = array.filter(reducerOnlyAuthors);

  const reducerLikes = (arr, item) => {
    const allInAuthor = array.filter((_) => _.author === item.author);
    const authorLikes = allInAuthor.reduce((a, b) => b.likes + a, 0);

    arr.push({
      author: item.author,
      likes: authorLikes,
    });
    return arr;
  };

  const reducerAll = onlyAuthors.reduce(reducerLikes, []); //)
  // console.log(reducerAll);
  const mostLikes = Math.max(...reducerAll.map((_) => _.likes));
  const mostLikesAuthor = reducerAll.filter((_) => _.likes === mostLikes);
  return { author, likes } = mostLikesAuthor[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
