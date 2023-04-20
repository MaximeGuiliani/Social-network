import { Router } from "express";
const router = Router();


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Subcribers were fetched'
    });


});


router.post('/', (req, res, next) => {
    const subscriber = {
        eventId: req.body.eventId,
        name: req.body.name
    };

    res.status(201).json({
        message: 'Subcribers were created',
        subscriber: subscriber
    });
});

router.get('/:subscribeId', (req, res, next) => {
    res.status(201).json({
        message: 'Subcribers details',
        subscribeId: req.params.subscribeId
    });
});

router.delete('/:subscribeId', (req, res, next) => {
    res.status(201).json({
        message: 'Subcribers deleted',
        subscribeId: req.params.subscribeId
    });
});
export default router;