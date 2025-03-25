<script>
    import { page } from "$app/stores";
    import "../app.css";
    let { children } = $props();
    let mobileMenuOpen = $state(false);
</script>

<nav class="mx-auto bg-gray-800 text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
        <a href="/" class="text-xl font-bold">pramari</a>

        <!-- Mobile menu button -->
        <button
            class="md:hidden flex items-center"
            onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
            aria-label="Toggle mobile menu"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                />
            </svg>
        </button>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
            <a href="/" class="hover:text-gray-300">Home</a>
            <a href="/protected" class="hover:text-gray-300">Features</a>

            {#if $page.data.session}
                <a href="/profile" class="flex items-center space-x-2">
                    <img
                        src={$page.data.session.user?.image}
                        alt="Profile"
                        class="w-8 h-8 rounded-full"
                    />
                    <span>{$page.data.session.user?.name?.split(" ")[0]}</span>
                </a>
                <form action="/auth/signout" method="POST">
                    <button type="submit" class="px-3 py-2 bg-red-600 rounded"
                        >Sign out</button
                    >
                </form>
            {:else}
                <form action="/auth/signin" method="POST">
                    <button type="submit" class="px-4 py-2 bg-blue-600 rounded"
                        >Sign in</button
                    >
                </form>
            {/if}
        </div>
        <!-- Mobile menu -->
        {#if mobileMenuOpen}
            <div class="md:hidden bg-gray-700 mt-2 p-4 rounded">
                <div class="flex flex-col space-y-3">
                    <a href="/" class="hover:text-gray-300">Home</a>
                    <a href="/features" class="hover:text-gray-300">Features</a>
                    <a href="/pricing" class="hover:text-gray-300">Pricing</a>

                    {#if $page.data.session}
                        <a
                            href="/profile"
                            class="flex items-center space-x-2 py-2"
                        >
                            <img
                                src={$page.data.session.user?.img}
                                alt="Profile"
                                class="w-8 h-8 rounded-full"
                            />
                            <span>Profile</span>
                        </a>
                        <form action="/auth/signout" method="POST">
                            <button type="submit" class="w-full text-left py-2"
                                >Sign out</button
                            >
                        </form>
                    {:else}
                        <form action="/auth/signin" method="POST">
                            <button type="submit" class="w-full text-left py-2"
                                >Sign in</button
                            >
                        </form>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</nav>

<!-- Main content container with fixed width -->
<main class="px-4 sm:px-6 lg:px-8 py-6">
    {@render children()}
</main>

<!-- Optional: Footer with fixed width -->
<footer class="bg-gray-100 border-t border-gray-200 mt-12">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="text-center md:text-left">
                <p class="text-gray-500">
                    &copy; 2007-{new Date().getFullYear()} pramari. All rights reserved.
                </p>
            </div>
            <div
                class="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6"
            >
                <!-- Social links -->
                <a
                    href="https://github.com/pramari"
                    class="text-gray-400 hover:text-gray-500"
                >
                    <span class="sr-only">GitHub</span>
                    <!-- GitHub icon -->
                </a>
            </div>
        </div>
    </div>
</footer>
