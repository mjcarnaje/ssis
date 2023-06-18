import { app } from "electron";
import path from "path";
import fs from "fs";

function saveImage<T extends Record<string, any>>(
  entity: T,
  existingEntity: T | null,
  propertyName: keyof T
): Promise<T> {
  return new Promise((resolve, reject) => {
    const isImageChanged = !entity[propertyName].includes(entity.id);
    const isImageExists = entity[propertyName] && !existingEntity;

    if (isImageChanged || isImageExists) {
      const storageDirectory = path.join(app.getPath("userData"), "storage");
      const subDirectoryPath = path.join(storageDirectory, entity.id);
      const imagePath = path.join(
        subDirectoryPath,
        `${String(propertyName)}.jpg`
      );

      fs.copyFile(entity[propertyName], imagePath, (err) => {
        if (err) reject(err);
        entity[propertyName] = imagePath as T[keyof T];
        resolve(entity);
      });
    } else {
      resolve(entity);
    }
  });
}

export { saveImage };
