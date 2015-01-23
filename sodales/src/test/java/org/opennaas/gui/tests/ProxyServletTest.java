package org.opennaas.gui.tests;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.opennaas.gui.proxy.ProxyFilter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class ProxyServletTest {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private ProxyFilter proxyFilter;

    @Test
    public void simpleTest() {
        assertEquals("OK", "OK");
    }
}
