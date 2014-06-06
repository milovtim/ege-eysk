<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"
            omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <div>

        <xsl:for-each select="reviews/review">
            <div class="review">
                <h6>
                    <xsl:value-of select="author"/>
                    <xsl:if test="contact">
                        <span class="glyphicon glyphicon-phone hidden-text" data-text="{contact}"></span>
                    </xsl:if>
                </h6>
                <div>
                    <xsl:value-of disable-output-escaping="yes" select="content"/>
                </div>
            </div>
        </xsl:for-each>

        </div>
    </xsl:template>

</xsl:stylesheet>