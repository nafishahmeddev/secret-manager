import { User } from "@app/db";
import AuthMiddleware from "@app/middleware/auth";
import TokenHelper from "@app/utils/token";
import { Router } from "express";

const router = Router({
  mergeParams: true
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      code: "ERROR",
      message: "Email and password are required",
    });
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({
      code: "ERROR",
      message: "User not found",
    });
  }
  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      code: "ERROR",
      message: "Invalid password",
    });
  }
  const tokens = TokenHelper.generateTokens(user);
  res.json({
    code: "SUCCESS",
    message: "Login successful",
    result: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
    },
  });
});

router.post("/logout", (req, res) => {
  // Invalidate the session or token here if needed
  res.json({
    code: "SUCCESS",
    message: "Logout successful",
  });
});

router.get("/verify", AuthMiddleware, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({
      code: "ERROR",
      message: "Unauthorized",
    });
  }

  const { id } = req.auth;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({
      code: "ERROR",
      message: "User not found",
    });
  }

  res.json({
    code: "SUCCESS",
    message: "User fetched successfully",
    result: {
      user: user
    },
  });
});



const AuthRouter = router;
export default AuthRouter;