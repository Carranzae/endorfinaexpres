export declare class SystemController {
    getSystemInfo(): {
        uptime: number;
        nodeVersion: string;
        platform: NodeJS.Platform;
        memoryUsage: {
            rss: number;
            heapUsed: number;
            heapTotal: number;
        };
        dbStatus: string;
    };
}
