
export function validateSignup(body) {
    if (!body || typeof body !== "object") throw new Error("Invalid request body");
    const { email, password } = body;
  
    // email
    if (!email) throw new Error("Email is required");
    if (typeof email !== "string") throw new Error("Email must be a string");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) throw new Error("Invalid email format");

    // password
    if (!password) throw new Error("Password is required");
    if (typeof password !== "string") throw new Error("Password must be a string");
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    
    return {email: normalizedEmail, password};
  }

  export function validateLogin(body) {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
  
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email");
    }
    if (!password || password.length < 6) {
      throw new Error("Invalid password");
    }
  
    return { email, password };
  }
  