package com.ontotext.ehri.controllers;

import com.ontotext.ehri.model.TransformationModel;
import com.ontotext.ehri.services.ResourceService;
import com.ontotext.ehri.services.TransformationService;
import com.ontotext.ehri.services.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Date;


@org.springframework.web.bind.annotation.RestController
@RequestMapping(value = "/rest")
public class RestController {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private TransformationService transformationService;

    @Autowired
    private ValidationService validationService;

    @RequestMapping(value = "/process", method = RequestMethod.GET)
    public String transform(TransformationModel transformationModel) {
        Date now = new Date();
        String transformationDir = transformationService.transform(transformationModel, now);
        String validation = validationService.validate(transformationModel, now);
        String[] validatonSplit = validation.split("\\|");
        if (validationService != null && validation.length() > 0) {
            validation = "";
            for (String val : validatonSplit) {
                validation += transformationDir + File.separator + "html" + File.separator + val + "|";
            }
        }
        return validation;
    }

    @RequestMapping(value = "/list-input-dir-contents", method = RequestMethod.GET)
    public String listInputDirContents() {
        return resourceService.listInputDirContents();
    }

    @RequestMapping(value = "/list-output-dir-contents", method = RequestMethod.GET)
    public String listOutputDirContents() {
        return resourceService.listOutputDirContents();
    }

    @RequestMapping(value = "/list-mapping-dir-contents", method = RequestMethod.GET)
    public String listMappingDirContents() {
        return resourceService.listMappingDirContents();
    }

    @RequestMapping(value = "/list-xquery-dir-contents", method = RequestMethod.GET)
    public String listXqueryDirContents() {
        return resourceService.listXqueryDirContents();
    }

    @RequestMapping(value = "/list-organisations", method = RequestMethod.GET)
    public String listOrganisations() {
        return resourceService.listOrganisations();
    }

    @RequestMapping(value = "/mapping-sheet-ID", method = RequestMethod.GET)
    public String mappingSheetID(@RequestParam("organisation") String organisation) {
        return resourceService.mappingSheetID(organisation);
    }

    @RequestMapping(value = "/mapping-sheet-range", method = RequestMethod.GET)
    public String mappingSheetRange(@RequestParam("organisation") String organisation) {
        return resourceService.mappingSheetRange(organisation);
    }

    @RequestMapping(value = "/error", method = RequestMethod.GET)
    public String errorPage(){
        return "errorPage";
    }

    @RequestMapping(value = "/htmlReport", method = RequestMethod.GET)
    public String getHtmlReport(@RequestParam("path") String path) {
        File file = new File(path);
        String fileContent = "";
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {

            String line;
            while ((line = br.readLine()) != null) {
                fileContent = fileContent + line + "\n";
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return fileContent;
    }

}
