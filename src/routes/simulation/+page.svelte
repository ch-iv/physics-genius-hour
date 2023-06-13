<script>
    import photo1 from '$lib/images/1.jpg';
    import { Canvas, Layer, t } from 'svelte-canvas';
    import {onMount} from "svelte";
    import Shuttle from '../shuttle.js';
    import RangeSlider from "svelte-range-slider-pips";

    let width, height;
    let angle, vi, force, tension;
    let off_x = 430;
    let off_y = 150;
    let initialized = false;
    let shuttle_size = 20;
    let s = new Shuttle(shuttle_size, shuttle_size + off_x, shuttle_size + off_y, 280, 50, 0.26, 24)
    let g = 9.8;
    let dragging = false;

    onMount(() => {
        initialized = true;
    })

    $: render = ({ context, width, height }) => {
        context.translate(0, height);
        context.scale(1, -1);
        s.draw(context)


        context.fillStyle = "yellow";
        [...Array(100).keys()].forEach(e => {
            let x = s.horizontal_displacement(e);
            let y = s.vertical_displacement(e);
            context.beginPath()
            context.arc(x, y, 5, 0, Math.PI * 2)
            context.fill()
            context.closePath()
        })
        context.fillStyle = 'grey'
        context.fillRect(0, 0, width, 10)

        let net_width = 20;
        let net_height = 200;
        context.fillStyle = 'red'
        context.fillRect(width/2 - net_width/2, 0, net_width, net_height)
    };

    function inside_circle(x, y, sh) {
        let canvas = document.getElementById("canvas")
        if (canvas == null){
            return false;
        }
        let rect = canvas.getBoundingClientRect();
        x -= rect.left
        y -= rect.top
        console.log(x, y)
        if (sh === undefined){
            return false;
        }
        var dx = x - sh.x;
        var dy = y - sh.y;
        return dx*dx + dy*dy <= sh.size * sh.size;
    }

</script>

{#if initialized}
    <div id="canvas" bind:clientWidth={width} bind:clientHeight={height} class="w-[100%] h-[100%] absolute">
        <Canvas {width} {height}
                on:mousemove={({ clientX: x, clientY: y }) => {
                  let is_hover = inside_circle(x, y, s);
                  console.log(inside_circle())
                }}
                on:mousedown={() => (dragging = true)}
                on:mouseup={() => (dragging = false)}
                on:mouseout={() => (dragging = false)}
        >
            <Layer {render} />
        </Canvas>
    </div>
    <div class=" font-anon text-white absolute w-[40%] p-8">
        <p>Angle: {angle} deg</p>
        <RangeSlider class="w-[100%]" bind:values={angle} pips all='label' on:change={e => s.angle = e.detail.values[0]}/>
        <p>Applied force: {force/10} N</p>
        <RangeSlider class="w-[100%]" bind:values={force} pips  min={10} max={550} on:change={e => s.force = e.detail.values[0]}/>
        <p>String tension: {tension} lbs</p>
        <RangeSlider class="w-[100%]" bind:values={tension} pips  min={15} max={32} on:change={e => s.tension = e.detail.values[0]}/>
        <p>X Offset: {off_x}</p>
        <RangeSlider class="w-[100%]" bind:values={off_x} pips  min={0} max={window.innerWidth/2-100} on:change={e => s.x = e.detail.values[0] + s.size}/>
        <p>Y Offset: {off_y}</p>
        <RangeSlider class="w-[100%]" bind:values={off_y} pips  min={0} max={300} on:change={e => s.y = e.detail.values[0] + s.size}/>
    </div>
{/if}


