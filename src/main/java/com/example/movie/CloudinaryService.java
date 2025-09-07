package com.example.movie;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Service
public class CloudinaryService {
    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload an image by remote URL (Cloudinary will fetch it).
     * Returns the upload result map (contains secure_url and public_id).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadByUrlMap(String imageUrl) {
        try {
            Map<String,Object> result = cloudinary.uploader().upload(imageUrl, ObjectUtils.asMap(
                    "folder", "movie_posters",
                    "use_filename", true,
                    "unique_filename", false,
                    "overwrite", false
            ));
            log.info("Cloudinary upload success: public_id={}, secure_url={}",
                    result.get("public_id"), result.get("secure_url"));
            return result;
        } catch (Exception e) {
            log.error("Cloudinary upload failed for url {}: {}", imageUrl, e.getMessage(), e);
            throw new RuntimeException("Cloudinary upload failed", e);
        }
    }
}
