// A visitor without a login token is a "guest".
export function isGuest() {
  return !localStorage.getItem("token");
}

const minutesAgo = (n) => new Date(Date.now() - n * 60 * 1000).toISOString();

// Sample posts shown to guests (the real feed needs a login)
export function getSamplePosts(tag = "For you") {
  const posts = [
    {
      _id: "sample-1",
      author: { _id: "s-maya", name: "Maya Khan", username: "maya_k" },
      text: "Small steps every day still take you somewhere new.",
      tag: "General",
      likes: 24,
      likedByMe: false,
      commentsCount: 3,
      createdAt: minutesAgo(12),
    },
    {
      _id: "sample-2",
      author: { _id: "s-hassan", name: "Hassan Ali", username: "hassan.codes" },
      text: "Pomodoro tip that saved my exam week: 25 minutes of focus, then 5 minutes away from the screen. After four rounds take a longer break and write down what you remember without looking at your notes.",
      tag: "Study",
      likes: 58,
      likedByMe: false,
      commentsCount: 9,
      createdAt: minutesAgo(45),
    },
    {
      _id: "sample-3",
      author: { _id: "s-sara", name: "Sara Ahmed", username: "sara_a" },
      text: "Free tip: the library has silent rooms you can book online. Much better than studying in the cafeteria!",
      tag: "Tips",
      likes: 41,
      likedByMe: false,
      commentsCount: 6,
      createdAt: minutesAgo(120),
    },
    {
      _id: "sample-4",
      author: { _id: "s-bilal", name: "Bilal Raza", username: "bilal_r" },
      text: "Spent the weekend in Murree with friends. Cold air, hot tea and zero deadlines. Highly recommend a short break before finals!",
      tag: "Travel",
      likes: 77,
      likedByMe: false,
      commentsCount: 12,
      createdAt: minutesAgo(300),
    },
    {
      _id: "sample-5",
      author: { _id: "s-ayesha", name: "Ayesha Noor", username: "ayesha.n" },
      text: "Group study works best when everyone prepares one topic and teaches it to the others. You learn twice as much when you have to explain it out loud.",
      tag: "Study",
      likes: 35,
      likedByMe: false,
      commentsCount: 4,
      createdAt: minutesAgo(1440),
    },
    {
      _id: "sample-6",
      author: { _id: "s-team", name: "ConnectSphere Team", username: "connectsphere" },
      text: "Welcome to ConnectSphere! Login or create an account to share your own posts, like and comment.",
      tag: "General",
      likes: 102,
      likedByMe: false,
      commentsCount: 0,
      createdAt: minutesAgo(2880),
    },
  ];
  return tag === "For you" ? posts : posts.filter((p) => p.tag === tag);
}