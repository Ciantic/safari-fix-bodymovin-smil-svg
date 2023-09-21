# Fixing Safari SVG SMIL files from Bodymovin export

Find all animate tags with xlink:href and move the animate tag inside the element with the id
E.g. 

```xml
<defs>
    <animate xlink:href="#the_path" ... />
</defs>
<path id="the_path" ... />
```

becomes

```xml
<defs>
</defs>
<path id="the_path" ... >
    <animate ... />
</path>
```

## Compile

```
deno compile --allow-read --allow-write fix-safari.ts
```