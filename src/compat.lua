
if not loadstring then
    function loadstring(str, chunkname)
        return load(str, chunkname)
    end
end

if not getfenv then
    function getfenv(f)
        if type(f) == "number" then
            f = debug.getinfo(f + 1, "f").func
        end
        local env = {}
        local i = 1
        while true do
            local k, v = debug.getupvalue(f, i)
            if not k then break end
            if k == "_ENV" then
                return v
            end
            i = i + 1
        end
        return _G
    end
end

if not setfenv then
    function setfenv(f, env)
        if type(f) == "number" then
            f = debug.getinfo(f + 1, "f").func
        end
        local i = 1
        while true do
            local k, v = debug.getupvalue(f, i)
            if not k then break end
            if k == "_ENV" then
                debug.upvaluejoin(f, i, (function()
                    return env
                end), 1)
                return f
            end
            i = i + 1
        end
        error("setfenv: no _ENV found")
    end
end

if not module then
    function module(name, ...)
        local env = {}
        _G[name] = env
        setmetatable(env, { __index = _G })
        setfenv(2, env)
    end
end

if not unpack then
    unpack = table.unpack
end
