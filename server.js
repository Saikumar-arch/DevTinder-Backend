/****************************************************
 * FULL BACKEND — READY FOR RENDER DEPLOYMENT
 ****************************************************/

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

// --- PRODUCTION HELPERS ---
// This variable checks if we are running on Render (Production) or Localhost
const isProduction = process.env.NODE_ENV === "production";

/****************************************************
 * 1. UPDATED CORS (Critical for Deployment)
 ****************************************************/
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://devtinder-backend-m3wn.onrender.com",
      "https://devtinder-we.netlify.app" // <--- ADD THIS EXACT URL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/****************************************************
 * 📦 IN-MEMORY DATABASE (Resets on every deploy)
 ****************************************************/

// 1. USERS
let users = [
  {
    firstName: "Sai",
    lastName: "Kumar",
    email: "Sai@gmail.com",
    password: bcrypt.hashSync("Sai@123", 10),
    photoUrl: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    age: 24,
    gender: "Male",
    about: "Infosys",
    skills: ["Software Engineer", "React Developer"],
  },
];


// 2. FEEDS (Full List of 30 Users with Working Images)
let feeds = [
  {
    id: "SN-1001",
    username: "Elon Musk",
    firstname: "Elon",
    lastname: "Musk",
    fullName: "Elon Musk",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elon_Musk_Colorado_2022_%28cropped%29.jpg/800px-Elon_Musk_Colorado_2022_%28cropped%29.jpg",
    profession: "CEO & Innovator",
    organisation: "Tesla, SpaceX",
    skills: ["Leadership", "Engineering", "Innovation"],
    about: "Elon Musk is a tech entrepreneur leading Tesla, SpaceX, and Neuralink.",
    age: 54,
    gender: "Male",
  },
  {
    id: "SN-1002",
    username: "Prabhas",
    firstname: "Uppalapati",
    lastname: "Prabhas Raju",
    fullName: "Prabhas Raju Uppalapati",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Prabhas_promoting_Saaho.jpg/800px-Prabhas_promoting_Saaho.jpg",
    profession: "Actor",
    organisation: "Tollywood Film Industry",
    skills: ["Acting", "Fitness", "Public Speaking"],
    about: "Prabhas is an Indian actor known for the Baahubali film series.",
    age: 45,
    gender: "Male",
  },
  {
    id: "SN-1003",
    username: "Taylor Swift",
    firstname: "Taylor",
    lastname: "Swift",
    fullName: "Taylor Alison Swift",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.jpg/800px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.jpg",
    profession: "Singer & Songwriter",
    organisation: "Republic Records",
    skills: ["Singing", "Songwriting", "Performance"],
    about: "Taylor Swift is an American singer-songwriter famous for her storytelling.",
    age: 35,
    gender: "Female",
  },
  {
    id: "SN-1004",
    username: "Lionel Messi",
    firstname: "Lionel",
    lastname: "Messi",
    fullName: "Lionel Andrés Messi",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/600px-Lionel_Messi_20180626.jpg",
    profession: "Football Player",
    organisation: "Inter Miami CF",
    skills: ["Football", "Leadership", "Sportsmanship"],
    about: "Lionel Messi is an Argentine footballer, widely considered among the greatest ever.",
    age: 38,
    gender: "Male",
  },
  {
    id: "SN-1005",
    username: "Cristiano Ronaldo",
    firstname: "Cristiano",
    lastname: "Ronaldo",
    fullName: "Cristiano Ronaldo dos Santos Aveiro",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/800px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg",
    profession: "Football Player",
    organisation: "Al-Nassr FC",
    skills: ["Football", "Fitness", "Motivation"],
    about: "Cristiano Ronaldo is a Portuguese footballer and global sports icon.",
    age: 40,
    gender: "Male",
  },
  {
    id: "SN-1006",
    username: "Sundar Pichai",
    firstname: "Sundar",
    lastname: "Pichai",
    fullName: "Pichai Sundararajan",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sundar_pichai.png/800px-Sundar_pichai.png",
    profession: "CEO",
    organisation: "Google",
    skills: ["Leadership", "Technology", "Strategy"],
    about: "Sundar Pichai is the CEO of Alphabet Inc., the parent company of Google.",
    age: 52,
    gender: "Male",
  },
  {
    id: "SN-1007",
    username: "Emma Watson",
    firstname: "Emma",
    lastname: "Watson",
    fullName: "Emma Charlotte Duerre Watson",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/800px-Emma_Watson_2013.jpg",
    profession: "Actor & Activist",
    organisation: "UN Women",
    skills: ["Acting", "Advocacy", "Public Speaking"],
    about: "Emma Watson is an English actress and activist for gender equality.",
    age: 35,
    gender: "Female",
  },
  {
    id: "SN-1008",
    username: "Bill Gates",
    firstname: "Bill",
    lastname: "Gates",
    fullName: "William Henry Gates III",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/800px-Bill_Gates_2017_%28cropped%29.jpg",
    profession: "Philanthropist",
    organisation: "Bill & Melinda Gates Foundation",
    skills: ["Programming", "Leadership", "Philanthropy"],
    about: "Bill Gates co-founded Microsoft and leads global health initiatives.",
    age: 69,
    gender: "Male",
  },
  {
    id: "SN-1009",
    username: "Gal Gadot",
    firstname: "Gal",
    lastname: "Gadot",
    fullName: "Gal Gadot Varsano",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Gal_Gadot_cropped_lighting_corrected_2b.jpg/800px-Gal_Gadot_cropped_lighting_corrected_2b.jpg",
    profession: "Actor & Producer",
    organisation: "Pilot Wave Films",
    skills: ["Acting", "Modeling", "Production"],
    about: "Gal Gadot is an Israeli actress best known for playing Wonder Woman.",
    age: 40,
    gender: "Female",
  },
  {
    id: "SN-1010",
    username: "Barack Obama",
    firstname: "Barack",
    lastname: "Obama",
    fullName: "Barack Hussein Obama II",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/800px-President_Barack_Obama.jpg",
    profession: "Former US President",
    organisation: "United States Government",
    skills: ["Leadership", "Public Speaking", "Policy"],
    about: "Barack Obama served as the 44th President of the United States.",
    age: 64,
    gender: "Male",
  },
  {
    id: "SN-1011",
    username: "Virat Kohli",
    firstname: "Virat",
    lastname: "Kohli",
    fullName: "Virat Kohli",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg/800px-Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg",
    profession: "Cricketer",
    organisation: "Indian Cricket Team",
    skills: ["Batting", "Leadership", "Fitness"],
    about: "Virat Kohli is an Indian cricketer and former captain known for his aggression and consistency.",
    age: 37,
    gender: "Male",
  },
  {
    id: "SN-1012",
    username: "Ariana Grande",
    firstname: "Ariana",
    lastname: "Grande",
    fullName: "Ariana Grande-Butera",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Ariana_Grande_at_the_2024_Met_Gala_03.jpg/800px-Ariana_Grande_at_the_2024_Met_Gala_03.jpg",
    profession: "Singer & Actor",
    organisation: "Republic Records",
    skills: ["Singing", "Acting", "Performance"],
    about: "Ariana Grande is a Grammy-winning singer known for her vocal range.",
    age: 32,
    gender: "Female",
  },
  {
    id: "SN-1013",
    username: "Narendra Modi",
    firstname: "Narendra",
    lastname: "Modi",
    fullName: "Narendra Damodardas Modi",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Narendra_Modi_2021.jpg/800px-Narendra_Modi_2021.jpg",
    profession: "Prime Minister of India",
    organisation: "Government of India",
    skills: ["Leadership", "Policy", "Public Speaking"],
    about: "Narendra Modi is the Prime Minister of India since 2014.",
    age: 75,
    gender: "Male",
  },
  {
    id: "SN-1014",
    username: "Oprah Winfrey",
    firstname: "Oprah",
    lastname: "Winfrey",
    fullName: "Oprah Gail Winfrey",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/800px-Oprah_in_2014.jpg",
    profession: "Television Host & Producer",
    organisation: "OWN Network",
    skills: ["Hosting", "Production", "Leadership"],
    about: "Oprah Winfrey is a television host and media executive known for 'The Oprah Winfrey Show'.",
    age: 71,
    gender: "Female",
  },
  {
    id: "SN-1015",
    username: "Tom Cruise",
    firstname: "Tom",
    lastname: "Cruise",
    fullName: "Thomas Cruise Mapother IV",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg/800px-Tom_Cruise_by_Gage_Skidmore_2.jpg",
    profession: "Actor & Producer",
    organisation: "Paramount Pictures",
    skills: ["Acting", "Production", "Stunts"],
    about: "Tom Cruise is an American actor known for his Mission: Impossible films.",
    age: 63,
    gender: "Male",
  },
  {
    id: "SN-1016",
    username: "Jennifer Lopez",
    firstname: "Jennifer",
    lastname: "Lopez",
    fullName: "Jennifer Lynn Lopez",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Jennifer_Lopez_at_The_Mother_premiere.jpg/800px-Jennifer_Lopez_at_The_Mother_premiere.jpg",
    profession: "Singer & Actor",
    organisation: "Nuyorican Productions",
    skills: ["Singing", "Acting", "Dance"],
    about: "Jennifer Lopez is an American singer and actress also known as J.Lo.",
    age: 56,
    gender: "Female",
  },
  {
    id: "SN-1017",
    username: "Robert Downey Jr",
    firstname: "Robert",
    lastname: "Downey Jr",
    fullName: "Robert John Downey Jr.",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/800px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg",
    profession: "Actor",
    organisation: "Marvel Studios",
    skills: ["Acting", "Production", "Comedy"],
    about: "Robert Downey Jr. is an American actor known for playing Iron Man.",
    age: 60,
    gender: "Male",
  },
  {
    id: "SN-1018",
    username: "Emma Stone",
    firstname: "Emma",
    lastname: "Stone",
    fullName: "Emily Jean Stone",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Emma_Stone_at_Maniac_UK_premiere_%28cropped%29.jpg/800px-Emma_Stone_at_Maniac_UK_premiere_%28cropped%29.jpg",
    profession: "Actor",
    organisation: "Hollywood",
    skills: ["Acting", "Comedy", "Drama"],
    about: "Emma Stone is an Oscar-winning actress known for 'La La Land'.",
    age: 37,
    gender: "Female",
  },
  {
    id: "SN-1019",
    username: "Mark Zuckerberg",
    firstname: "Mark",
    lastname: "Zuckerberg",
    fullName: "Mark Elliot Zuckerberg",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/800px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
    profession: "CEO",
    organisation: "Meta Platforms",
    skills: ["Programming", "Leadership", "Business"],
    about: "Mark Zuckerberg is the founder and CEO of Meta (formerly Facebook).",
    age: 41,
    gender: "Male",
  },
  {
    id: "SN-1020",
    username: "Rihanna",
    firstname: "Robyn",
    lastname: "Fenty",
    fullName: "Robyn Rihanna Fenty",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rihanna_Fenty_2018.png/800px-Rihanna_Fenty_2018.png",
    profession: "Singer & Entrepreneur",
    organisation: "Fenty Beauty",
    skills: ["Singing", "Fashion", "Business"],
    about: "Rihanna is a Barbadian singer and businesswoman known for Fenty Beauty.",
    age: 37,
    gender: "Female",
  },
  {
    id: "SN-1021",
    username: "Keanu Reeves",
    firstname: "Keanu",
    lastname: "Reeves",
    fullName: "Keanu Charles Reeves",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Keanu_Reeves_2019.jpg/800px-Keanu_Reeves_2019.jpg",
    profession: "Actor",
    organisation: "Warner Bros",
    skills: ["Acting", "Martial Arts", "Production"],
    about: "Keanu Reeves is a Canadian actor known for The Matrix and John Wick.",
    age: 61,
    gender: "Male",
  },
  {
    id: "SN-1022",
    username: "Kylie Jenner",
    firstname: "Kylie",
    lastname: "Jenner",
    fullName: "Kylie Kristen Jenner",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Kylie_Jenner_in_2021.png/800px-Kylie_Jenner_in_2021.png",
    profession: "Entrepreneur & Model",
    organisation: "Kylie Cosmetics",
    skills: ["Fashion", "Marketing", "Business"],
    about: "Kylie Jenner is an entrepreneur known for her beauty brand Kylie Cosmetics.",
    age: 28,
    gender: "Female",
  },
  {
    id: "SN-1023",
    username: "Sachin Tendulkar",
    firstname: "Sachin",
    lastname: "Tendulkar",
    fullName: "Sachin Ramesh Tendulkar",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sachin_Tendulkar_in_2015.jpg/800px-Sachin_Tendulkar_in_2015.jpg",
    profession: "Cricketer",
    organisation: "Indian Cricket Board",
    skills: ["Batting", "Mentoring", "Strategy"],
    about: "Sachin Tendulkar is a legendary Indian cricketer known as the 'God of Cricket'.",
    age: 52,
    gender: "Male",
  },
  {
    id: "SN-1024",
    username: "Selena Gomez",
    firstname: "Selena",
    lastname: "Gomez",
    fullName: "Selena Marie Gomez",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Selena_Gomez_-_Harold_and_the_Purple_Crayon_premiere_-_02_%28cropped%29.jpg/800px-Selena_Gomez_-_Harold_and_the_Purple_Crayon_premiere_-_02_%28cropped%29.jpg",
    profession: "Singer & Actor",
    organisation: "Rare Beauty",
    skills: ["Singing", "Acting", "Business"],
    about: "Selena Gomez is an American singer and actress who founded Rare Beauty.",
    age: 33,
    gender: "Female",
  },
  {
    id: "SN-1025",
    username: "Jeff Bezos",
    firstname: "Jeff",
    lastname: "Bezos",
    fullName: "Jeffrey Preston Bezos",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg/800px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg",
    profession: "Entrepreneur",
    organisation: "Amazon, Blue Origin",
    skills: ["Leadership", "Innovation", "Business"],
    about: "Jeff Bezos is the founder of Amazon and Blue Origin.",
    age: 61,
    gender: "Male",
  },
  {
    id: "SN-1026",
    username: "Deepika Padukone",
    firstname: "Deepika",
    lastname: "Padukone",
    fullName: "Deepika Padukone",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Deepika_Padukone_Cannes_2018.jpg/800px-Deepika_Padukone_Cannes_2018.jpg",
    profession: "Actor",
    organisation: "Bollywood",
    skills: ["Acting", "Dance", "Modeling"],
    about: "Deepika Padukone is a top Indian actress and producer.",
    age: 39,
    gender: "Female",
  },
  {
    id: "SN-1027",
    username: "Chris Hemsworth",
    firstname: "Chris",
    lastname: "Hemsworth",
    fullName: "Christopher Hemsworth",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg/800px-Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg",
    profession: "Actor",
    organisation: "Marvel Studios",
    skills: ["Acting", "Fitness", "Production"],
    about: "Chris Hemsworth is an Australian actor famous for portraying Thor in the MCU.",
    age: 42,
    gender: "Male",
  },
  {
    id: "SN-1028",
    username: "Greta Thunberg",
    firstname: "Greta",
    lastname: "Thunberg",
    fullName: "Greta Tintin Eleonora Ernman Thunberg",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Greta_Thunberg_Urgent_Question_House_of_Commons_23_April_2019_%2846848476955%29_%28cropped%29.jpg/800px-Greta_Thunberg_Urgent_Question_House_of_Commons_23_April_2019_%2846848476955%29_%28cropped%29.jpg",
    profession: "Climate Activist",
    organisation: "Fridays for Future",
    skills: ["Public Speaking", "Activism", "Awareness"],
    about: "Greta Thunberg is a Swedish environmental activist known for inspiring global climate movements.",
    age: 22,
    gender: "Female",
  },
  {
    id: "SN-1029",
    username: "LeBron James",
    firstname: "LeBron",
    lastname: "James",
    fullName: "LeBron Raymone James Sr.",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/LeBron_James_crop_2020.jpg/800px-LeBron_James_crop_2020.jpg",
    profession: "Basketball Player",
    organisation: "Los Angeles Lakers",
    skills: ["Basketball", "Leadership", "Philanthropy"],
    about: "LeBron James is an American basketball player regarded as one of the greatest in NBA history.",
    age: 40,
    gender: "Male",
  },
  {
    id: "SN-1030",
    username: "Billie Eilish",
    firstname: "Billie",
    lastname: "Eilish",
    fullName: "Billie Eilish Pirate Baird O'Connell",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Billie_Eilish_at_the_2019_iHeartRadio_Music_Awards_red_carpet_%28cropped%29.jpg/800px-Billie_Eilish_at_the_2019_iHeartRadio_Music_Awards_red_carpet_%28cropped%29.jpg",
    profession: "Singer & Songwriter",
    organisation: "Darkroom/Interscope",
    skills: ["Singing", "Songwriting", "Performance"],
    about: "Billie Eilish is an American singer-songwriter known for her unique sound and style.",
    age: 23,
    gender: "Female",
  },
];


// 3. CONNECTIONS
let connections = [
  {
    fromUserId: "SN-1001",
    toUserId: "Sai@gmail.com",
    status: "interested",
  },
  {
    fromUserId: "SN-1002",
    toUserId: "Sai@gmail.com",
    status: "interested",
  },
];

/****************************************************
 * 🔐 AUTH & MIDDLEWARE
 ****************************************************/
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET || "secretKey", { expiresIn: "7d" });
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// REGISTER
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: "All fields are required" });

  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { firstName, lastName, email, password: hashed };
  users.push(newUser);

  res.status(201).json({ message: "User registered successfully", user: { firstName, lastName, email } });
});

// LOGIN (UPDATED COOKIE LOGIC)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(email);

  // CRITICAL: Different cookie settings for Localhost vs Production
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: isProduction, // TRUE on Render (https), FALSE on localhost
    sameSite: isProduction ? "None" : "Lax", // NONE on Render (Cross-site), LAX on localhost
  });

  return res.json({
    message: "Login successful",
    user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
  });
});

// LOGOUT
app.post("/api/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });
  res.json({ message: "Logout successful" });
});

/****************************************************
 * 👤 PROFILE ROUTES
 ****************************************************/
app.get("/api/profile", verifyToken, (req, res) => {
  const user = users.find((u) => u.email === req.user.email);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "Profile fetched", user: { ...user, password: undefined } });
});

app.patch("/api/profile/edit", verifyToken, (req, res) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills } = req.body;
  const user = users.find((u) => u.email === req.user.email);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (photoUrl) user.photoUrl = photoUrl;
  if (age) user.age = age;
  if (gender) user.gender = gender;
  if (about) user.about = about;
  if (skills) user.skills = Array.isArray(skills) ? skills : [skills];

  res.json({ message: "Profile updated", user: { ...user, password: undefined } });
});

/****************************************************
 * 📱 FEED & CONNECTION LOGIC
 ****************************************************/

// 1. SMART FEED API
app.get("/api/feed", verifyToken, (req, res) => {
  const loggedInUser = req.user.email;
  const hiddenUsers = new Set();

  connections.forEach((c) => {
    if (c.fromUserId === loggedInUser) hiddenUsers.add(c.toUserId);
    if (c.toUserId === loggedInUser) hiddenUsers.add(c.fromUserId);
  });

  const feedData = feeds.filter((user) => !hiddenUsers.has(user.id));
  res.json({ data: feedData });
});

// 2. SEND REQUEST
app.post("/api/request/send/:status/:toUserId", verifyToken, (req, res) => {
  const fromUserId = req.user.email;
  const { toUserId, status } = req.params;

  const allowedStatus = ["interested", "ignored"];
  if (!allowedStatus.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const toUser = feeds.find((f) => f.id === toUserId);
  if (!toUser) return res.status(404).json({ message: "User not found" });

  connections.push({ fromUserId, toUserId, status });
  res.json({ message: status === "interested" ? "Request Sent!" : "User Ignored" });
});

// 3. GET RECEIVED REQUESTS
app.get("/api/user/requests/received", verifyToken, (req, res) => {
  const loggedInUser = req.user.email;
  const receivedRequests = connections.filter(
    (c) => c.toUserId === loggedInUser && c.status === "interested"
  );

  const data = receivedRequests
    .map((c) => {
      const sender = feeds.find((user) => user.id === c.fromUserId);
      return sender ? { ...sender, requestId: c.fromUserId } : null;
    })
    .filter((u) => u !== null);

  res.json({ data });
});

// 4. REVIEW REQUEST
app.post("/api/request/review/:status/:requestId", verifyToken, (req, res) => {
  const loggedInUser = req.user.email;
  const { status, requestId } = req.params;

  const allowedStatus = ["accepted", "rejected"];
  if (!allowedStatus.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const request = connections.find(
    (c) => c.toUserId === loggedInUser && c.fromUserId === requestId && c.status === "interested"
  );

  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = status;
  res.json({ message: `Request ${status}` });
});

// 5. GET MY CONNECTIONS
app.get("/api/user/connections", verifyToken, (req, res) => {
  const loggedInUser = req.user.email;

  const myConnections = connections.filter(
    (c) => (c.fromUserId === loggedInUser || c.toUserId === loggedInUser) &&
           (c.status === "accepted" || (c.fromUserId === loggedInUser && c.status === "interested"))
  );

  const data = myConnections
    .map((c) => {
        const otherId = c.fromUserId === loggedInUser ? c.toUserId : c.fromUserId;
        return feeds.find((user) => user.id === otherId);
    })
    .filter((u) => u !== undefined);

  res.json({ data });
});

// 6. BULK ADD (For Testing)
app.post("/api/connections/bulk", verifyToken, (req, res) => {
  const { ids, status } = req.body;
  const fromUserId = req.user.email;
  const requestStatus = status || "interested";

  if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: "Invalid IDs" });

  ids.forEach((targetId) => {
    const exists = connections.find(c => c.fromUserId === fromUserId && c.toUserId === targetId);
    if (!exists && feeds.find(f => f.id === targetId)) {
      connections.push({ fromUserId, toUserId: targetId, status: requestStatus });
    }
  });

  res.json({ message: "Bulk connections added!" });
});

/****************************************************
 * 2. START SERVER (Updated Port Logic)
 ****************************************************/
// Render assigns a random port to process.env.PORT, so we must use it.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
  console.log(`🌍 Environment: ${isProduction ? "Production (Render)" : "Development (Localhost)"}`);
});