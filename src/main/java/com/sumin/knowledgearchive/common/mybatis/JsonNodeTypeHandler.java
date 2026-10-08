package com.sumin.knowledgearchive.common.mybatis;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.postgresql.util.PGobject;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(JsonNode.class)
public class JsonNodeTypeHandler extends BaseTypeHandler<JsonNode> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, JsonNode parameter, JdbcType jdbcType) throws SQLException {
        try {
            // PostgreSQL은 jsonb 타입으로 명시적인 PGobject를 전달해야 안전
            PGobject pgObject = new PGobject();
            pgObject.setType("jsonb");
            pgObject.setValue(objectMapper.writeValueAsString(parameter));
            ps.setObject(i, pgObject);
        } catch (Exception e) {
            throw new SQLException("Error setting JsonNode parameter", e);
        }
    }

    @Override
    public JsonNode getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return parseJson(rs.getString(columnName));
    }

    @Override
    public JsonNode getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return parseJson(rs.getString(columnIndex));
    }

    @Override
    public JsonNode getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return parseJson(cs.getString(columnIndex));
    }

    private JsonNode parseJson(String json) throws SQLException {
        if (json == null) {
            return null;
        }
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new SQLException("Error parsing JSON string to JsonNode", e);
        }
    }
}
