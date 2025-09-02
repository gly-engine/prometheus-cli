if not io.lines then
    io.lines = function(filename)
        local file = io.open(filename, "r")
        if not file then return function() return nil end end
        local content = file:read("*a")
        file:close()
        local lines = {}
        for line in string.gmatch(content or "", "([^\n]*)\n?") do
            table.insert(lines, line)
        end
        local i = 0
        return function()
            i = i + 1
            return lines[i]
        end
    end
end
