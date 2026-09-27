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

local function page_break()
  if FORMAT:match("latex") then
    return pandoc.RawBlock("latex", "\\clearpage")
  end
  if FORMAT == "docx" then
    return pandoc.RawBlock(
      "openxml",
      '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
    )
  end
end

function Header(header)
  local text = pandoc.utils.stringify(header.content)
  if header.level == 1 and text:match("^Anexo [IVXLCDM]+ ") then
    local break_block = page_break()
    if break_block then
      return { break_block, header }
    end
  end
end
