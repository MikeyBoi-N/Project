divs will be used for vertical stacking.

Within a div, there can be:
    grids
        images
        text
    
copy the styles from https://www.capellaspace.com/technology#satellite-tech
https://www.anduril.com/hardware/solid-rocket-motors/
https://www.spacex.com/



section (full page width + height)
    content wrapper (flex)
        *if positioned side by side* figure (image), then text
            both of these should have felx, display, width (or height) similar
        If overlapping, then both should have same left and top starting positions, and then be adjusted from there.

Rules:
- ensure content is centered, remains within container for vertical and horizontal overflow
- keep it simple
- CSS modules should be unique (try to resist INLINE CSS)

