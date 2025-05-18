[retrofit 使用示例](https://www.baeldung.com/retrofit)

### Spring Boot3排错
一次 Spring Boot3的排错

本地IDEA正常能从`resources/template/job.xml`文件读取，当项目打包jar后就找不到job.xml文件。

```
ava.io.FileNotFoundException:
class path resource [templates/jenkins-job.xml] cannot be resolved to absolute file path because it does not reside in the file system: 
jar:nested:/home/jenkinsrole/finaljava-build/githost-0.0.1-SNAPSHOT.jar/!BOOT-INF/classes/!/templates/jenkins-job.xml
at org.springframework.util.ResourceUtils.getFile(ResourceUtils.java:223)
```
这个错误表明 Spring Boot 尝试从 ​​JAR 包内部​​ 直接访问 `templates/jenkins-job.xml` 文件时失败了，因为文件被打包在 JAR 中，无法通过传统的 File API 直接操作。

错误本质​​：使用了 `ResourceUtils.getFile()` 或 `new File(classpathResource.getPath())` 这类需要文件系统路径的方法，但文件实际位于 JAR 包内（路径格式为 jar:file:...），无法直接当作普通文件访问。

- 开发环境​​：文件在 target/classes/ 下，可以当作普通文件读取。
- ​​生产环境​​：文件在 JAR 包的 BOOT-INF/classes/ 中，只能通过流（InputStream）读取。

解决方案：使用 ClassPathResource + InputStream

```java
public static Result<String> generateConfig(JenkinsJobConfig jobConfig) throws IOException, DocumentException {
    // 用 InputStream 读取，兼容 JAR 内/外部文件
    ClassPathResource resource = new ClassPathResource("templates/jenkins-job.xml");
    try (InputStream inputStream = resource.getInputStream()) {
        SAXReader reader = new SAXReader();
        Document doc = reader.read(inputStream); // 直接从流读取
        log.info("read job template: {}", doc.asXML());
        
        // ... 后续处理逻辑
        return Result.success(doc.asXML());
    }
}
```

排错收获：花了很长时间才发现错误根源，因为没用好 try catch，开始的报错提示装载 xml 的变量为 null，后来一步步添加 catch 才发现是文件没找到。异常最好进行有价值的错误信息提示。