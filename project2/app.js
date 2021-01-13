const posts = [{ title: "post1" }, { title: "post2" }];

function createPost(post) {
  return new Promise((resolve, rejects) => {
    const time = [1000, 3000, 5000];
    const random = Math.floor(Math.random() * time.length);

    setTimeout(() => {
      let error = false;
      if (!error) {
        posts.push(post);
        resolve(posts);
      } else {
        rejects("Error in pushing posts");
      }
    }, time[random]);
  });
}

createPost({ title: "post3" })
  .then((data) => createPost({ title: "post4" }))
  .then((data) => createPost({ title: "post5" }))
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log(posts);
    console.log("settled");
  });

// Promise all

Promise.all([createPost({ title: "post6" }), createPost({ title: "post7" })])
  .then(() => {
    console.log("all posts", posts);
  })
  .catch((err) => {
    console.log(err);
  });
