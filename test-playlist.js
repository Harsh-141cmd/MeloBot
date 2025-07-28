const { Player, QueryType } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');

// Test script for YouTube playlist issues
async function testPlaylistSearch() {
    console.log('Testing YouTube playlist search...');
    
    // Create a mock client for testing
    const mockClient = {
        user: { id: 'test' }
    };
    
    const player = new Player(mockClient, {
        skipFFmpeg: true // Skip FFmpeg for testing
    });
    
    try {
        // Register the YouTube extractor
        await player.extractors.register(YoutubeiExtractor, {});
        console.log('✅ YoutubeiExtractor registered successfully');
        
        // Test playlist URLs (you can replace with the actual playlist URL you're testing)
        const testUrls = [
            'https://www.youtube.com/playlist?list=PLrAELYQHeYdS4k80y5oD6YFOLpRu7ZuMh', // Example playlist
            'https://youtube.com/playlist?list=PLrAELYQHeYdS4k80y5oD6YFOLpRu7ZuMh'   // Alternative format
        ];
        
        for (const url of testUrls) {
            console.log(`\n🔍 Testing: ${url}`);
            
            try {
                const result = await player.search(url, {
                    requestedBy: { id: 'test-user' },
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                });
                
                console.log(`✅ Search successful!`);
                console.log(`   Tracks found: ${result.tracks.length}`);
                console.log(`   Playlist title: ${result.playlist?.title || 'Unknown'}`);
                console.log(`   Playlist URL: ${result.playlist?.url || 'Unknown'}`);
                
                if (result.tracks.length > 0) {
                    console.log(`   First track: ${result.tracks[0].title}`);
                }
                
            } catch (searchError) {
                console.error(`❌ Search failed for ${url}:`);
                console.error(`   Error: ${searchError.message}`);
                console.error(`   Stack: ${searchError.stack}`);
            }
        }
        
        // Test with AUTO search engine too
        console.log(`\n🔍 Testing with QueryType.AUTO`);
        try {
            const result = await player.search(testUrls[0], {
                requestedBy: { id: 'test-user' },
                searchEngine: QueryType.AUTO
            });
            
            console.log(`✅ AUTO search successful!`);
            console.log(`   Tracks found: ${result.tracks.length}`);
        } catch (autoError) {
            console.error(`❌ AUTO search failed: ${autoError.message}`);
        }
        
    } catch (extractorError) {
        console.error('❌ Failed to register extractor:', extractorError);
    }
    
    console.log('\nTest completed. Replace the test URLs above with your actual playlist URL for specific testing.');
}

testPlaylistSearch();
