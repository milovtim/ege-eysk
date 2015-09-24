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

            proj.files(dataFiles)
            .each { File dataFile ->
                Map<String, Object> data
                dataFile.withInputStream {
                    data = yml.load(it) as Map<String, Object>
                }

                def baseName = dataFile.name.split('\\.')[0]
                Template template = freemrkrConfig.getTemplate("${baseName}.ftl")
                template.process(data, new OutputStreamWriter(System.out))
            }

        }
    }

    private Configuration initFreemarker() {
        def config = new Configuration(Configuration.VERSION_2_3_23)
        config.directoryForTemplateLoading = project.file(project.staticSite.layoutDir)
        config.defaultEncoding = 'UTF-8'
        config.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER)
        config
    }
}