package org.opennaas.gui.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.CollectionTable;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OrderColumn;

import org.opennaas.gui.JsonViews;

import org.codehaus.jackson.map.annotate.JsonView;

/**
 * JPA Annotated Pojo that represents a news entry.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
@javax.persistence.Entity
public class ServiceProvider implements Entity {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Date date;

    @Column
    private String name;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="viList")
    @OrderColumn(insertable=true,updatable=true,name="viOrder")
    private List<String> vi = new ArrayList<String>();

    public ServiceProvider() {
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

    @JsonView(JsonViews.User.class)
    public List<String> getVi() {
        return vi;
    }

    public void setVi(List<String> vi) {
        this.vi = vi;
    }
    
    @Override
    public String toString() {
        return String.format("HistoryEntry[%s, %d]", this.name, this.id);
    }

}
