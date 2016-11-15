# Tiles DEVICE

## API for Tiles DEVICE
<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Parameter1</th>
        <th>Parameter2</th>
        <th>Implemented</th>
        <th>Comments</th>
    </tr><tr>
        <td>Tile_XX,</td>
        <td>led,</td>
        <td>off</td>
        <td>-</td>
        <td>yes</td>
        <td></td>
    </tr><tr>
        <td></td>
        <td></td>
        <td>on,</td>
        <td>red, green, blue, white</td>
        <td>yes</td>
        <td></td>
    </tr><tr>
        <td></td>
        <td></td>
        <td>on,</td>
        <td>{HEX}</td>
        <td>yes</td>
        <td>example: FF00FF=pink</td>
    </tr><tr>
        <td></td>
        <td></td>
        <td>blink,</td>
        <td>red, green, blue, white</td>
        <td>yes</td>
        <td></td>
    </tr><tr>
        <td></td>
        <td></td>
        <td>blink,</td>
        <td>{HEX}</td>
        <td>yes</td>
        <td></td>
    </tr><tr>
        <td></td>
        <td></td>
        <td>fade,</td>
        <td>red, green, blue, white</td>
        <td>only blue color implemented</td>
        <td></td>
    </tr><tr>
    <td></td><td></td><td></td><td></td><td></td><td></td>
    </tr><tr>
         <td></td>
         <td>haptic,</td>
         <td>long</td>
         <td>-</td>
         <td>yes</td>
         <td>long vibration</td>
     </tr><tr>
         <td></td>
         <td></td>
         <td>burst</td>
         <td>-</td>
         <td>yes</td>
         <td>short vibration</td>
     </tr>
</table>

##Example
Turn on LED with color RED on 'Tile_XX' send command:
```javascript
"Tile_XX,led,on,red"
```
or use HEX
```javascript
"Tile_XX,led,on,FF0000"
```
