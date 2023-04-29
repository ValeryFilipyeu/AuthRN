import axios from "axios";
import { createUser, login } from "./auth";
import { API_KEY } from "@env";

jest.mock("axios");

describe("Authentication", () => {
  const email = "test@example.com";
  const password = "password123";
  const token = "abc123";

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      axios.post.mockResolvedValueOnce({ data: { idToken: token } });

      const result = await createUser(email, password);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      );
      expect(result).toEqual(token);
    });

    it("should throw an error if the request fails", async () => {
      const errorMessage = "Failed to create user";
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(createUser(email, password)).rejects.toThrow(errorMessage);
    });
  });

  describe("login", () => {
    it("should log in the user", async () => {
      axios.post.mockResolvedValueOnce({ data: { idToken: token } });

      const result = await login(email, password);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      );
      expect(result).toEqual(token);
    });

    it("should throw an error if the request fails", async () => {
      const errorMessage = "Failed to log in";
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(login(email, password)).rejects.toThrow(errorMessage);
    });
  });
});

