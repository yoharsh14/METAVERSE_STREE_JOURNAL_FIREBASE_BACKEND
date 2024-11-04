const db = require("../firebase");
const generateTokenAndSetCookie = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password, repeatpassword } =
      req.body;
    if (password != repeatpassword) {
      return res.status(400).json({ error: "Passord don't match" });
    }
    await db
      .collection("users")
      .where("username", "==", username)
      .get()
      .then(async (snapshot) => {
        if (snapshot.empty) {
          //username is available, we can register the new user
          const profilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          db.collection("users")
            .add({
              firstName,
              lastName,
              username,
              email,
              password: hashedPassword,
              profilePic,
              profileBio: "",
              phoneNumber: "",
              xLinking: "",
              linkedinLink: "",
              telegramLink: "",
              discordLink: "",
              youtubeLink: "",
              lineIDLink: "",
              uplandMeIGN: "",
              sandboxUsername: "",
              decentralandUsername: "",
            })
            .then(async (docRef) => {
              // generateTokenAndSetCookie(newUser._id, res);
              const newUser = await docRef.get();
              console.log("NEW USER", newUser);
            });
        } else {
          // username already existed in the collection
          console.log("Username already exists!");
          console.log(snapshot)
          return res.status(404).json({ error: "username already exist" });
        }
      });
  } catch (e) {
    console.log("Error in login controller", e.message);
    res.status(404).json({ error: e });
  }
};

// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     const isPasswordCorrect = await bcrypt.compare(
//       password || " ",
//       user.password || " "
//     );
//     if (!user || !isPasswordCorrect) {
//       res.status(400).json({ error: "Invalid credentials" });
//     } else {
//       generateTokenAndSetCookie(user._id, res);
//       res.status(200).json({
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         username: user.username,
//         profilePic: user.profilePic,
//       });
//     }
//   } catch (e) {
//     console.log("Error in login controller", e.message);
//     res.status(404).json({ error: e });
//   }
// };
// const logout = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 0 });
//     res.status(200).json({ messsage: "Logged out successfully" });
//   } catch (error) {
//     console.log("Error in logout controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

module.exports = { register };
