package org.opennaas.gui.entity;


import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.opennaas.gui.JsonViews;

import org.codehaus.jackson.map.annotate.JsonView;

/**
 * JPA Annotated Pojo that represents a news entry.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
@javax.persistence.Entity
public class virtualResource implements Entity {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String name;
    
    @Column
    private String type;

    public virtualResource(String name, String type) {
        this.name = name;
        this.type = type;
    }

    @JsonView(JsonViews.User.class)
    public Long getId() {
        return this.id;
    }

    @JsonView(JsonViews.User.class)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    @JsonView(JsonViews.User.class)
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return String.format("HistoryEntry[%s, %d]", this.name, this.id);
    }

}
