local function header_text(table_block)
  if not table_block.head or #table_block.head.rows == 0 then
    return ""
  end
  local values = {}
  for _, cell in ipairs(table_block.head.rows[1].cells) do
    table.insert(values, pandoc.utils.stringify(cell.contents))
  end
  return table.concat(values, " | ")
end

function Table(table_block)
  local count = #table_block.colspecs
  if count == 2 then
    local header = header_text(table_block)
    local first = header:match("Por HappyHomes") and 0.5 or 0.34
    table_block.colspecs = {
      { pandoc.AlignLeft, first },
      { pandoc.AlignLeft, 1 - first },
    }
  elseif count == 3 then
    table_block.colspecs = {
      { pandoc.AlignLeft, 0.22 },
      { pandoc.AlignLeft, 0.36 },
      { pandoc.AlignLeft, 0.42 },
    }
  end
  return table_block
end

function Header(header)
  if header.level == 1 and pandoc.utils.stringify(header.content):match("^Anexo I ") then
    return {
      pandoc.RawBlock("latex", "\\clearpage"),
      header,
    }
  end
end
