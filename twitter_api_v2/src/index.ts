import { TwitterApi, TwitterApiv2 } from 'twitter-api-v2';

// Interfaces for type safety
interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
}

interface FormattedTweet {
  id: string;
  text: string;
  createdAt: string;
  metrics: TweetMetrics;
  url: string;
}

interface TwitterServiceConfig {
  bearerToken: string;
}

class TwitterService {
  private readonly client: TwitterApi;
  private readonly readOnlyClient: any;

  constructor(config: TwitterServiceConfig) {
    this.client = new TwitterApi(config.bearerToken);
    this.readOnlyClient = this.client.readOnly;
  }

  /**
   * Fetches recent tweets for a given username
   * @param username - Twitter username without @ symbol
   * @param tweetLimit - Maximum number of tweets to retrieve (default: 10)
   * @returns Promise containing array of formatted tweets
   */
  public async getRecentTweets(
    username: string,
    tweetLimit: number = 10
  ): Promise<FormattedTweet[]> {
    try {
      // Get user ID from username
      const user = await this.readOnlyClient.v2.userByUsername(username);

      if (!user.data) {
        throw new Error(`User '${username}' not found`);
      }

      // Fetch tweets with additional fields
      const tweets = await this.readOnlyClient.v2.userTimeline(user.data.id, {
        max_results: tweetLimit,
        "tweet.fields": ['created_at', 'public_metrics'],
      });

      const formattedTweets: FormattedTweet[] = [];

      for await (const tweet of tweets) {
        formattedTweets.push({
          id: tweet.id,
          text: tweet.text,
          createdAt: new Date(tweet.created_at!).toLocaleString(),
          metrics: {
            likes: tweet.public_metrics!.like_count,
            retweets: tweet.public_metrics!.retweet_count,
            replies: tweet.public_metrics!.reply_count,
            quotes: tweet.public_metrics!.quote_count,
          },
          url: `https://twitter.com/${username}/status/${tweet.id}`,
        });
      }

      return formattedTweets;

    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  }

  /**
   * Formats tweet data for display
   * @param tweets - Array of formatted tweets
   * @returns Formatted string for console output
   */
  public static formatTweetsForDisplay(tweets: FormattedTweet[]): string {
    return tweets
      .map((tweet) => {
        return `
Tweet ID: ${tweet.id}
Content: ${tweet.text}
Posted: ${tweet.createdAt}
Metrics:
  - Likes: ${tweet.metrics.likes}
  - Retweets: ${tweet.metrics.retweets}
  - Replies: ${tweet.metrics.replies}
  - Quotes: ${tweet.metrics.quotes}
URL: ${tweet.url}
-------------------`;
      })
      .join('\n');
  }
}

// Error types for better error handling
export class TwitterServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TwitterServiceError';
  }
}

// Example usage
async function main() {
  try {
    // Configuration object
    const config: TwitterServiceConfig = {
      bearerToken: 'your_bearer_token_here'
    };

    // Initialize service
    const twitterService = new TwitterService(config);

    // Get tweets
    const tweets = await twitterService.getRecentTweets('example_user', 5);

    // Display formatted tweets
    console.log('Recent Tweets:');
    console.log(TwitterService.formatTweetsForDisplay(tweets));

    // Example of working with the tweet data programmatically
    const highEngagementTweets = tweets.filter(
      tweet => tweet.metrics.likes > 100 || tweet.metrics.retweets > 50
    );

    console.log('\nHigh engagement tweets:',
      highEngagementTweets.length ?
        TwitterService.formatTweetsForDisplay(highEngagementTweets) :
        'No high engagement tweets found'
    );

  } catch (error) {
    if (error instanceof TwitterServiceError) {
      console.error('Twitter Service Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Module exports
export { TwitterService, type FormattedTweet, type TwitterServiceConfig };

// Run the example
//@ts-ignore
if (require.main === module) {
  main().catch(console.error);
}