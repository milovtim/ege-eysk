package ru.milovtim

import freemarker.template.Configuration
import freemarker.template.Template
import freemarker.template.TemplateExceptionHandler
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.yaml.snakeyaml.Yaml

class SiteBuilder implements Plugin<Project> {

    Project project

    @Override
    void apply(Project proj) {
        this.project = proj

        proj.extensions.create('staticSite', BuilderSettings)

        proj.task('sitebldr') << {

            def yml = new Yaml()
            def freemrkrConfig = initFreemarker()

            def dataFiles = proj.file(proj.staticSite.dataDir).listFiles({it.name.endsWith('.yaml')} as FileFilter)

            proj.files(dataFiles).each { File dataFile ->
                Map<String, Object> pageInfoMap = dataFile.withInputStream(yml.&load) as Map<String, Object>

                def pageInfo = new PageInfo(layoutName: pageInfoMap.layout, partNames: pageInfoMap.parts as List)

                preparePageLayout(pageInfo, freemrkrConfig)

                def baseName = dataFile.name.split('\\.')[0]
//                Template template = freemrkrConfig.getTemplate("${baseName}.ftl")
                template.process(pageInfo, new OutputStreamWriter(System.out))
            }

        }
    }

    Template preparePageLayout(PageInfo pageInfo, Configuration configuration) {
        configuration.getTemplate("${project.staticSite.layoutDir}/${pageInfo.layoutName}")
    }

    private Configuration initFreemarker() {
        def config = new Configuration(Configuration.VERSION_2_3_23)
        config.with {
            directoryForTemplateLoading = project.file(project.staticSite.templatesDir)
            defaultEncoding = 'UTF-8'
            templateExceptionHandler = TemplateExceptionHandler.RETHROW_HANDLER
        }
        config
    }
}