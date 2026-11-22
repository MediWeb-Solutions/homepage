<script lang="ts">
    import { navitems } from "$lib/navitems";

</script>

<nav aria-label="Hovedmeny">
    <ul role="navigation" class="main-navigation">
        {#each navitems as item}
            <li>
                <a href={item.href}>{item.title}</a>
                {#if item.children}
                    <ul role="navigation" class="sub-navigation">
                        {#each item.children as child}
                            <li>
                                <a href={child.href}>{child.title}</a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {/each}
    </ul>
</nav>