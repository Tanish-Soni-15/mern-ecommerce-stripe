export function verifyUser() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkUser`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      reject({ data });
    }
    resolve({ data });
  });
}

export function signOut() {
  return new Promise(async (resolve) => {
    const respone = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });
    const data = await respone.json();
    console.log(data);

    resolve({ data });
  });
}
