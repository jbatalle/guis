package org.opennaas.gui.tests;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.opennaas.gui.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class JsonSerializerRequestsTest {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Test
    public void simpleTest() {
        System.out.println("First test");
        assertEquals("OK", "OK");
    }

    @Test
    public void serializer() {
        String xml = "", json = "";
        System.out.println("Second test");
        json = "{'rootResourceDescriptor':'{specification={type=NETWORK, model=Internal, version=1.0}, _xmlns:ns2=org.mqnaas, __prefix=ns2}'}";
        json = "{'rootResourceDescriptor':'{specification={type=NETWORK, model=Internal, version=1.0}, _xmlns:ns2=org.mqnaas, __prefix=ns2}'}";
        xml = Utils.adaptJsonToXml(json);
        assertEquals(getXML(), xml);
    }

    private String getXML() {
        String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><ns2:rootResourceDescriptor xmlns:ns2=\"org.mqnaas\"><specification><model>Internal</model><type>NETWORK</type><version>1.0</version></specification></ns2:rootResourceDescriptor>";
        return xml;
    }
}
