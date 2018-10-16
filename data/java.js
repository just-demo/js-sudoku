package ed.self;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT;
import static com.google.common.io.Files.createParentDirs;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static org.apache.commons.io.FileUtils.readFileToString;
import static org.apache.commons.io.FileUtils.writeStringToFile;

public class BanksDataFetcher {
    private static final String options = "" +
        "<option value=\"2018-07-01\">2 квартала 2018</option>\n" +
        "<option value=\"2018-05-14\">1 квартала 2018</option>\n" +
        "<option value=\"2018-03-07\">4 квартала 2017</option>\n" +
        "<option value=\"2017-12-07\">3 квартала 2017</option>\n" +
        "<option value=\"2017-08-18\">2 квартала 2017</option>\n" +
        "<option value=\"2017-05-21\">1 квартала 2017</option>\n" +
        "<option value=\"2017-01-01\">4 квартала 2016</option>\n" +
        "<option value=\"2016-10-01\">3 квартала 2016</option>\n" +
        "<option value=\"2016-07-01\">2 квартала 2016</option>\n" +
        "<option value=\"2016-04-01\">1 квартала 2016</option>\n" +
        "<option value=\"2016-01-01\">4 квартала 2015</option>\n" +
        "<option value=\"2015-10-01\">3 квартала 2015</option>\n" +
        "<option value=\"2015-07-01\">2 квартала 2015</option>\n" +
        "<option value=\"2015-04-01\">1 квартала 2015</option>\n" +
        "<option value=\"2015-01-01\">4 квартала 2014</option>\n" +
        "<option value=\"2014-10-01\">3 квартала 2014</option>\n" +
        "<option value=\"2014-07-01\">2 квартала 2014</option>\n" +
        "<option value=\"2014-04-01\">1 квартала 2014</option>\n" +
        "<option value=\"2014-01-01\">4 квартала 2013</option>\n" +
        "<option value=\"2013-10-01\">3 квартала 2013</option>\n" +
        "<option value=\"2013-07-01\">2 квартала 2013</option>\n" +
        "<option value=\"2013-04-01\">1 квартала 2013</option>\n" +
        "<option value=\"2013-01-01\">4 квартала 2012</option>";

    public static void main(String[] args) throws Exception {
//        extractAndSaveAllJson();
//        fetchAndSaveBankDetails();
    extractAndSaveBankDetails();
}

private static void extractAndSaveAllJson() throws Exception {
    extractAndSaveBankNames();
    extractAndSaveBankRatings();
    extractAndSaveBankRatingDetails();
}

private static void fetchAndSaveAllHtml() throws Exception {
    fetchAndSaveRatings();
    extractAndSaveBankRatingDetails();
    fetchAndSaveBanks();
}

private static void extractAndSaveBankNames() {
    writeFile(jsonBanksFile(), toJson(new TreeMap<>(extractBankNames())));
}

private static Map<Long, Map<String, String>> extractBankNames() {
    String html = readFile(htmlBanksFile());

    Map<Long, Map<String, String>> bankNames = new HashMap<>();
    Pattern pattern = Pattern.compile("class=\"bank-emblem--desktop\"[\\S\\s]+?/company/(.+?)/[\\S\\s]+?<a href=\"/company/(.+?)/\">(.+?)</a>");
    Matcher matcher = pattern.matcher(html);
    while (matcher.find()) {
        String id = matcher.group(1);
        String alias = matcher.group(2);
        String name = matcher.group(3);
        Map<String, String> bankName = new HashMap<>();
        bankName.put("alias", alias);
        bankName.put("name", name);
        bankNames.put(Long.valueOf(id), bankName);
    }

    return bankNames;
}

/*
...
<td class="sustain-rating--table-td number-column" data-id="58">
<div style="height: 0; width: 0;" id="place1"></div>
...
</td>
<td class="sustain-rating--table-td" data-title="Общий рейтинг"><span class="fixedNumber">4.56</span>
&nbsp;<div class="sustain-rating--table-stars" data-sort="1">
...
</td>
<td class="sustain-rating--table-td" data-title="Стрессо-устойчивость">4.6</td>
<td class="sustain-rating--table-td" data-title="Лояльность вкладчиков">4.4</td>
<td class="sustain-rating--table-td" data-title="Оценкааналитиков">4.82</td>
<td class="sustain-rating--table-td more" data-title="Место в рэнкинге по депозитам физлиц ">
<span>5
<div title="Нажмите, чтобы увидеть дополнительную информацию"></div>
</span>
...
Overall rating
Stress resistance
Depositors loyalty
 */
private static void fetchAndSaveBanks() {
    String html = readURL("https://minfin.com.ua/banks/all/");
    writeFile(htmlBanksFile(), html);
}


private static void extractAndSaveBankDetails() {
    Map<Long, Map<String, String>> banks = extractBankNames();
    banks.forEach((id, bank) -> {
        String alias = bank.get("alias");
        String html = readFile(htmlBankFile(alias));
        Pattern pattern = Pattern.compile("<div class=\"item-title\">Офіційний сайт</div>[\\S\\s]+?<a.*? href=\"(.+?)\" target=\"_blank\">");
        Matcher matcher = pattern.matcher(html);
        while (matcher.find()) {
            String site = matcher.group(1);
            bank.put("site", site);
        }
    });

    writeFile(jsonBankDetailsFile(), toJson(new TreeMap<>(banks)));
}

private static void fetchAndSaveBankDetails() {
    Map<Long, Map<String, String>> banks = extractBankNames();
    banks.values().forEach(bank -> {
        String alias = bank.get("alias");
        String html = readURL("https://minfin.com.ua/ua/company/" + alias);
        writeFile(htmlBankFile(alias), html);
    });
}

private static Map<Long, BigDecimal> extractBankRatings(String date) {
    Map<Long, BigDecimal> ratings = new HashMap<>();
    String html = readFile(htmlRatingsFile(date));
    Pattern pattern = Pattern.compile("data-id=\"(.+?)\"[\\S\\s]+?data-title=\"Общий рейтинг\"><span.*?>(.+?)</span>");
    Matcher matcher = pattern.matcher(html);
    while (matcher.find()) {
        String bankId = matcher.group(1);
        String rating = matcher.group(2);
        ratings.put(Long.valueOf(bankId), new BigDecimal(rating));
    }
    return ratings;
}

private static Map<Long, String> extractBankNames(String date) {
    Map<Long, String> bankNames = new HashMap<>();
    String html = readFile(htmlRatingsFile(date));
    Pattern pattern = Pattern.compile("data-id=\"(.+?)\"[\\S\\s]+?<a href=\"/company/.+?/rating/\">\\s*?<span.*?>(.+?)</span>");
    Matcher matcher = pattern.matcher(html);
    while (matcher.find()) {
        String bankId = matcher.group(1);
        String bankName = matcher.group(2);
        bankNames.put(Long.valueOf(bankId), bankName);
    }
    return bankNames;
}

private static void extractAndSaveBankRatings() throws IOException {
    Map<String, Map<Long, BigDecimal>> ratings = getDates().stream().collect(toMap(
        Function.identity(),
        BanksDataFetcher::extractBankRatings
    ));
    writeFile(jsonRatingsFile(), toJson(ratings));
}

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

private static String formatJson(String json) {
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
    mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
    try {
        return toJson(mapper.readValue(json, Object.class));
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
}

private static String toJson(Object object) {
    ObjectMapper mapper = new ObjectMapper();
    mapper.enable(INDENT_OUTPUT);
    try {
        return mapper.writeValueAsString(object);
    } catch (JsonProcessingException e) {
        throw new UncheckedIOException(e);
    }
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

private static List<String> getDates() {
    return stream(options.split("\n")).map(option -> option.split("\"")[1]).collect(toList());
}

private static void fetchAndSaveRatings() {
    getDates().forEach(BanksDataFetcher::fetchAndSaveRating);
}

private static void fetchAndSaveRating(String date) {
    //https://minfin.com.ua/img/company/58/logo/1532080477.jpg
    String content = readURL("https://minfin.com.ua/banks/rating/?date=" + date);
    File outFile = htmlRatingsFile(date);
    writeFile(outFile, content);
}

private static String readURL(String url) {
    try {
        HttpClient httpClient = HttpClients.createDefault();
        HttpResponse response = httpClient.execute(new HttpGet(url));
        return IOUtils.toString(response.getEntity().getContent(), UTF_8);
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
}


private static File htmlRatingsFile(String date) {
    return dataFolder().resolve("html").resolve("ratings").resolve(date + ".html").toFile();
}

private static File htmlBanksFile() {
    return dataFolder().resolve("html").resolve("banks.html").toFile();
}

private static File htmlBankFile(String alias) {
    return dataFolder().resolve("html").resolve("banks").resolve(alias + ".html").toFile();
}

private static File jsonRatingDetailsFile() {
    return dataFolder().resolve("json").resolve("bank-rating-details.json").toFile();
}

private static File jsonRatingsFile() {
    return dataFolder().resolve("json").resolve("bank-ratings.json").toFile();
}

private static File jsonBanksFile() {
    return dataFolder().resolve("json").resolve("banks.json").toFile();
}

private static File jsonBankDetailsFile() {
    return dataFolder().resolve("json").resolve("bank-details.json").toFile();
}

private static Path dataFolder() {
    return Paths.get("data");
}

private static String readFile(File file) {
    try {
        return readFileToString(file, UTF_8);
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
}

private static void writeFile(File file, String data) {
    try {
        writeStringToFile(file, data, UTF_8);
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
}
}
