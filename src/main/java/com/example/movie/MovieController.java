package com.example.movie;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieRepository repo;
    private final CloudinaryService cloudinaryService;

    public MovieController(MovieRepository repo, CloudinaryService cloudinaryService) {
        this.repo = repo;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public List<Movie> list() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateMovieRequest req) {
        String incoming = req.getPosterUrl();
        String storedUrl = incoming;
        String publicId = null;

        if (incoming != null && !incoming.contains("res.cloudinary.com")) {
            try {
                Map<String,Object> result = cloudinaryService.uploadByUrlMap(incoming);
                storedUrl = (String) result.get("secure_url");
                publicId = (String) result.get("public_id");
            } catch (Exception e) {
                // return a 500 so failure is visible to client
                return ResponseEntity.status(500).body("Failed to upload image to Cloudinary: " + e.getMessage());
            }
        }

        Movie m = new Movie();
        m.setTitle(req.getTitle());
        m.setPosterUrl(storedUrl);
        m.setPublicId(publicId);
        m.setGenre(req.getGenre());
        m.setWatched(req.isWatched());

        Movie saved = repo.save(m);
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/{id}/toggle")
    public ResponseEntity<Movie> toggle(@PathVariable Long id) {
        return repo.findById(id)
                .map(m -> {
                    m.setWatched(!m.isWatched());
                    Movie updated = repo.save(m);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // DTO for create
    public static class CreateMovieRequest {
        private String title;
        private String posterUrl;
        private String genre;
        private boolean watched;
        // getters & setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getPosterUrl() { return posterUrl; }
        public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
        public String getGenre() { return genre; }
        public void setGenre(String genre) { this.genre = genre; }
        public boolean isWatched() { return watched; }
        public void setWatched(boolean watched) { this.watched = watched; }
    }
}
