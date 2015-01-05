/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.opennaas.gui.utils;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class Utils {

    public static String adaptJsonToXml(String json) {
        
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
        JSONObject o = new JSONObject(json);
        Iterator<String> it = o.keys();
        String key = "";
        Map<String, String> t = parseJson(o);
        while (it.hasNext()) {
            key = it.next();
            xml.append("<ns2:" + key + " xmlns:ns2=\"org.mqnaas\">");
            String specs = jsonComponentToXml(t.get(key));
            xml.append(specs);
        }
        xml.append("</ns2:" + key + ">");
        return xml.toString();
    }

    private static String jsonComponentToXml(String json) throws JSONException {
        json = json.replaceAll(", _xmlns:ns2=org.mqnaas, __prefix=ns2", "");
        json = json.replaceAll("=", ":");
        JSONObject o = new JSONObject(json);
        String xml = org.json.XML.toString(o);
        return xml;
    }

    private static Map<String, String> parseJson(JSONObject data) {
        Map<String, String> response = new HashMap<String, String>();
        if (data != null) {
            Iterator<String> it = data.keys();
            while (it.hasNext()) {
                String key = it.next();

                try {
                    if (data.get(key) instanceof JSONArray) {
                        JSONArray arry = data.getJSONArray(key);
                        int size = arry.length();
                        for (int i = 0; i < size; i++) {
                            parseJson(arry.getJSONObject(i));
                        }
                    } else if (data.get(key) instanceof JSONObject) {
                        parseJson(data.getJSONObject(key));
                    } else {
                        System.out.println("Key: " + key + " : " + data.optString(key));
                        response.put(key, data.optString(key));
                    }
                } catch (Throwable e) {
                    System.out.println("" + key + " : " + data.optString(key));
                    e.printStackTrace();
                }
            }
        }
        return response;
    }

    public static String convertToJson(Object myObject) {
        if (myObject instanceof Map<?, ?>) {
            final Map<?, ?> map = (Map<?, ?>) myObject;
            final StringBuilder sb = new StringBuilder("{");
            boolean first = true;
            for (final Map.Entry<?, ?> entry : map.entrySet()) {
                if (first) {
                    first = false;
                } else {
                    sb.append(",");
                }
                sb.append("\n\t'")
                        .append(entry.getKey())
                        .append("':'")
                        .append(entry.getValue())
                        .append("'");
            }
            if (!first) {
                sb.append("\n");
            }
            sb.append("}");
            System.out.println(sb.toString());
return sb.toString();
        } else {
            System.out.println(myObject);
        }
        return "";
    }
}
