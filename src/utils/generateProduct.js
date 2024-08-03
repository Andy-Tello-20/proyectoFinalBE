import { faker } from "@faker-js/faker";

function generateImageObject() {
  const includeImage = faker.datatype.boolean();

  if (includeImage) {
    const imageName = faker.system.commonFileName("jpg");
    return {
      name: imageName,
    };
  } else {
    return {
      name: "non-image",
    };
  }
}

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(10),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 1, max: 999 }),
    stock: faker.number.int(1000),
    code: faker.commerce.isbn(),
    category: faker.commerce.department(),
    status: faker.helpers.arrayElement(["Available", "Not Available"]),
    images: [generateImageObject()],
  };
};
