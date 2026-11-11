import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export class StorageService {
  /**
   * Genera un nombre de archivo seguro limpiando caracteres especiales y anteponiendo un timestamp
   */
  private sanitizeFileName(fileName: string): string {
    const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `${Date.now()}_${cleanName}`;
  }

  /**
   * Helper base de subida con seguimiento de progreso
   */
  private async uploadToPath(
    fullPath: string,
    file: File,
    allowedTypesPrefix: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!file) {
      throw new Error("No se proporcionó ningún archivo para subir.");
    }

    if (allowedTypesPrefix && !file.type.startsWith(allowedTypesPrefix) && !file.type.includes(allowedTypesPrefix)) {
      throw new Error(`Tipo de archivo inválido (${file.type}). Se esperaba un archivo de tipo ${allowedTypesPrefix}.`);
    }

    const destinationRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(destinationRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (onProgress && snapshot.totalBytes > 0) {
            const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(percentage);
          }
        },
        (error) => {
          console.error(`Error subiendo archivo a ${fullPath}:`, error);
          reject(new Error(`Fallo al subir archivo: ${error.message}`));
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (err: any) {
            reject(new Error(`Fallo al obtener la URL pública: ${err.message}`));
          }
        }
      );
    });
  }

  /**
   * 1. Path: projects/{projectId}/images/{filename}
   */
  async uploadProjectImage(
    projectId: string | number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const cleanId = String(projectId || "new").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = this.sanitizeFileName(file.name);
    const path = `projects/${cleanId}/images/${fileName}`;
    return this.uploadToPath(path, file, "image/", onProgress);
  }

  /**
   * 2. Path: profilePhoto/{profilephoto}
   */
  async uploadProfilePhoto(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const fileName = this.sanitizeFileName(file.name);
    const path = `profilePhoto/${fileName}`;
    return this.uploadToPath(path, file, "image/", onProgress);
  }

  /**
   * 3. Path: certificates/{certificateId}/image/{filename}
   */
  async uploadCertificateImage(
    certificateId: string | number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const cleanId = String(certificateId || "new").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = this.sanitizeFileName(file.name);
    const path = `certificates/${cleanId}/image/${fileName}`;
    return this.uploadToPath(path, file, "image/", onProgress);
  }

  /**
   * 4. Path: certificates/{certificateId}/document/{filename} (PDF, Documento o Imagen)
   */
  async uploadCertificateDocument(
    certificateId: string | number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const cleanId = String(certificateId || "new").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = this.sanitizeFileName(file.name);
    const path = `certificates/${cleanId}/document/${fileName}`;
    return this.uploadToPath(path, file, "", onProgress);
  }

  /**
   * Elimina un archivo de Storage
   */
  async deleteFile(filePathOrUrl: string): Promise<void> {
    try {
      const fileRef = ref(storage, filePathOrUrl);
      await deleteObject(fileRef);
    } catch (error: any) {
      console.warn("No se pudo eliminar el archivo en Storage:", error.message);
    }
  }
}

export const storageService = new StorageService();

