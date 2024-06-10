import api from "../axios";

export const getSession = async (context?: any) => {
  try {
    const response = await api.get("/api/session", {
      headers: context ? { cookie: context.req.headers.cookie } : undefined,
    });
    return response.data.user;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return { error: "You are not authenticated, you can't access this page" };
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
