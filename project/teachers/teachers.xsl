<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"
            omit-xml-declaration="yes"/>

    <xsl:template match="/teachers">
        <div class="slider">
            <ul class="slides">
                <xsl:apply-templates select="teacher"/>
            </ul>
        </div>
    </xsl:template>

    <xsl:template match="teacher">
        <li>
            <div class="showStaff">
                <img class="showcase-image"
                     src="{imageUrl}"
                     alt="{descr/meta}"/>
                <div class="showcase-description">
                    <h3>
                        <xsl:value-of select="descr/fio"/>
                    </h3>
                    <p class="meta">
                        <xsl:value-of select="descr/meta"/>
                    </p>
                    <blockquote cite="{cite/content/@link}">
                        <xsl:value-of select="cite/content"/>
                    </blockquote>
                    <cite>
                        <a href="{cite/author/wikiLink}">
                            <xsl:value-of select="cite/author/name"/>
                        </a>
                    </cite>
                </div>
            </div>
        </li>
    </xsl:template>

</xsl:stylesheet>

