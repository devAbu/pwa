const posts = [{ title: "post1" }, { title: "post2" }];

function createPost(post, cb) {
  const time = [1000, 3000, 5000];
  const random = Math.floor(Math.random() * time.length);

  setTimeout(() => {
    posts.push(post);
    console.log(posts);
    cb();
  }, time[random]);
}

createPost({ title: "post3" }, () => {
  createPost({ title: "post4" }, () => {
    createPost({ title: "post5" }, () => {
      console.log("Finish");
    });
  });
});
