export const convertDollarToRupees = (usdPrice) => {

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(usdPrice);
};
