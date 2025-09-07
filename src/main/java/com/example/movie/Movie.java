package com.example.movie;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Column(length = 1000)
    private String publicId;

    // getter + setter
    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(length = 2000)
    private String posterUrl;
    private String genre;
    private boolean watched;

    // constructors, getters, setters
    public Movie() {}
    public Movie(String title, String posterUrl, String genre, boolean watched) {
        this.title = title;
        this.posterUrl = posterUrl;
        this.genre = genre;
        this.watched = watched;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public boolean isWatched() { return watched; }
    public void setWatched(boolean watched) { this.watched = watched; }
}
