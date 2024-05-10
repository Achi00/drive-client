import api from "../axios";

export const getSession = async () => {
  try {
    const response = await api.get("/api/session");
    return response.data.user;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // User is not authenticated
      // window.location.href = "/login";
      throw new Error("You are not authenticated,\nYou can't access this page");
    }
    console.error("Error fetching session:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    if (response.data.success) {
      // Redirect to the login page after successful logout
      window.location.href = "/login";
    } else {
      console.error("Logout failed:", response.data.message);
    }
  } catch (error: any) {
    console.error("Error logging out:", error.response.data);
  }
};
