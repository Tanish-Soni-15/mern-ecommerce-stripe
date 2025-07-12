// A mock function to mimic making an async request for data
export function fetchAllProducts() {
  return new Promise(async (resolve) => {
    const respone = await fetch("http://localhost:8081/products");
    const data = await respone.json();
    resolve(data);
  }
  );
}

export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8081/products/${id}`) 
    const data = await response.json()
    resolve(data)
  }
  );
}
