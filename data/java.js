

private static void extractAndSaveBankRatingDetails() throws Exception {
    String json = "{" +
        getDates().stream()
            .map(date -> "\"" + date + "\": " + extractRatingsJson(date).replaceAll("(\\d+):", "\"$1\":"))
            .collect(joining(",\n")) +
        "}";
    json = json.replaceAll("'", "\"");
    json = formatJson(json);
    File outFile = jsonRatingDetailsFile();
    createParentDirs(outFile);
    writeFile(outFile, json);
}


private static String extractRatingsJson(String date) {
    String html = readFile(htmlRatingsFile(date));
    Pattern pattern = Pattern.compile("<script>\\s*data\\s*=([^;]+);\\s*</script>");
    Matcher matcher = pattern.matcher(html);
    if (matcher.find()) {
        return matcher.group(1).trim();
    }

    throw new RuntimeException("Cannot retrieve json for " + date);
}
