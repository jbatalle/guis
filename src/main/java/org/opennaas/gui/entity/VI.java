package org.opennaas.gui.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;

import org.opennaas.gui.JsonViews;

import org.codehaus.jackson.map.annotate.JsonView;

/**
 * JPA Annotated Pojo that represents a news entry.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
@javax.persistence.Entity
public class VI implements Entity {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Date date;

    @Column
    private String name;
    
    private ArrayList<virtualResource> viRes = new ArrayList<virtualResource>();

    public VI() {
        this.date = new Date();
    }

    @JsonView(JsonViews.User.class)
    public Long getId() {
        return this.id;
    }

    @JsonView(JsonViews.User.class)
    public Date getDate() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @JsonView(JsonViews.User.class)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<virtualResource> getViRes() {
        return viRes;
    }

    public void setViRes(ArrayList<virtualResource> viRes) {
        this.viRes = viRes;
    }
    
    @Override
    public String toString() {
        return String.format("HistoryEntry[%s, %d]", this.name, this.id);
    }

}
