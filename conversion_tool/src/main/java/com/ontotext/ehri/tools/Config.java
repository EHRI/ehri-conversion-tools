package com.ontotext.ehri.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Config {
    public static final Charset ENCODING = StandardCharsets.UTF_8;

    private static final Logger LOGGER = LoggerFactory.getLogger(Config.class);
    private static final String CONFIGURATION_PATH = "/config.yml";

    private static final Map<String, Object> CONFIGURATION = configuration();
    private static Map<String, Object> configuration() {
        Map<String, Object> configuration = null;
        Yaml yaml = new Yaml();

        // load base configuration
        LOGGER.info("loading base configuration from: " + CONFIGURATION_PATH);
        try (InputStream inputStream = Config.class.getResourceAsStream(CONFIGURATION_PATH)) {
            configuration = (Map<String, Object>) yaml.load(inputStream);
        } catch (IOException e) {
            LOGGER.error("failed to load base configuration from: " + CONFIGURATION_PATH);
            System.exit(1);
        }

        String userConfigPath = (String) configuration.get("user-config-path");
        File userConfigFile = new File(userConfigPath);

        // load user configuration if present
        if (userConfigFile.isFile()) {
            LOGGER.info("loading user configuration from: " + userConfigFile.getAbsolutePath());
            try (InputStream inputStream = new FileInputStream(userConfigFile)) {
                Map<String, Object> userConfig = (Map<String, Object>) yaml.load(inputStream);

                // override base configuration with user configuration if non-empty
                if (userConfig != null) configuration.putAll(userConfig);
                else LOGGER.warn("empty user configuration at: " + userConfigFile.getAbsolutePath());

            } catch (IOException e) {
                LOGGER.error("failed to load user configuration from: " + userConfigFile.getAbsolutePath());
            }

        } else {
            LOGGER.warn("no user configuration at: " + userConfigFile.getAbsolutePath());
        }

        return configuration;
    }

    private static final Map<String, String[]> ORGANISATION_MAPPINGS = organisationMappings();
    private static Map<String, String[]> organisationMappings() {
        Map<String, String[]> organisationMappings = new HashMap<String, String[]>();
        String sheetID = (String) param("organisation-mappings-sheet");
        String sheetRange = (String) param("organisation-mappings-sheet-range");
        if (sheetID == null || sheetRange == null) {
            LOGGER.warn("missing sheet with organisation mappings");
            return organisationMappings;
        }

        LOGGER.info("reading organisation mappings from Google Sheet with ID: " + sheetID);
        List<List<Object>> sheet = GoogleSheetReader.values(sheetID, sheetRange);
        for (List<Object> row : sheet) {
            String organisation = (String) row.get(0);
            String[] mappingAndRange = new String[2];
            mappingAndRange[0] = (String) row.get(1);
            mappingAndRange[1] = (String) row.get(2);
            organisationMappings.put(organisation, mappingAndRange);
        }

        return organisationMappings;
    }

    /**
     * Return the value of the configuration parameter with the given name.
     * @param name The name of the configuration parameter.
     * @return The value of the configuration parameter, or null if no such parameter exists.
     */
    public static Object param(String name) {
        Object value = CONFIGURATION.get(name);
        if (value == null) LOGGER.warn("no such parameter: " + name);
        return value;
    }

    public static String[] organisations() {
        return ORGANISATION_MAPPINGS.keySet().toArray(new String[ORGANISATION_MAPPINGS.size()]);
    }

    public static String mappingSheetID(String organisation) {
        return ORGANISATION_MAPPINGS.get(organisation)[0];
    }

    public static String mappingSheetRange(String organisation) {
        return ORGANISATION_MAPPINGS.get(organisation)[1];
    }
}
