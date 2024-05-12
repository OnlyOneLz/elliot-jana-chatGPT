export const apiFetch = async (token) => {
  try {
    const response = await fetch(`http://localhost:4000/protected`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data.userId;
  } catch (error) {
    console.error("Error adding message", error);
  }
};

export default apiFetch;
